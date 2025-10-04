#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AsteroidAnalysis.py
Analiza NEOs reales obtenidos desde el backend local (NeoWS.py con Uvicorn en 6789).
- Descarga lista de NEOs (hoy+mañana)
- Enriquecimiento con detalle por ID
- Cálculo de masa, energía cinética y equivalente TNT
- Heurística de nivel de riesgo (bajo/medio/alto/critico)
- Exportación opcional a JSON/CSV

Uso:
  python3 AsteroidAnalysis.py --limit 10 --save-json resources/asteroid_analysis.json
  python3 AsteroidAnalysis.py --hazard-only --save-csv resources/asteroid_analysis.csv
"""

import os
import sys
import math
import json
import csv
import argparse
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

import requests

API_BASE = os.getenv("MM_API_BASE", "http://127.0.0.1:6789")  # tu backend FastAPI
DENSITY_KG_M3_DEFAULT = float(os.getenv("MM_DENSITY", "3000"))  # densidad típica 2.5–3.5 t/m3

# -------------------------
# Utilidades numéricas
# -------------------------
def to_float(x: Any, default: float = 0.0) -> float:
    try:
        return float(x)
    except Exception:
        return default

def est_mass_energy(
    d_km_min: Optional[float],
    d_km_max: Optional[float],
    rel_v_kps: Optional[float],
    density_kg_m3: float = DENSITY_KG_M3_DEFAULT
) -> Tuple[Optional[float], Optional[float], Optional[float]]:
    """
    Retorna (mass_kg, energy_J, energy_MtTNT) o (None, None, None) si falta data.
    """
    if not d_km_min or not d_km_max or not rel_v_kps:
        return (None, None, None)

    d_km = (d_km_min + d_km_max) / 2.0
    r_m = (d_km * 1000.0) / 2.0
    volume_m3 = (4.0 / 3.0) * math.pi * (r_m ** 3)
    mass_kg = volume_m3 * density_kg_m3

    v_mps = rel_v_kps * 1000.0
    energy_J = 0.5 * mass_kg * (v_mps ** 2)
    energy_MtTNT = energy_J / 4.184e15
    return (mass_kg, energy_J, energy_MtTNT)

def pick_earth_approach(close_approach_data: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Elige el acercamiento a la Tierra más próximo a 'ahora' (o el primero disponible).
    """
    if not close_approach_data:
        return None
    earth = [c for c in close_approach_data if c.get("orbiting_body") == "Earth"]
    if not earth:
        return None

    def key_fn(c):
        # intenta parsear close_approach_date_full; fallback a close_approach_date
        ds = c.get("close_approach_date_full") or c.get("close_approach_date")
        try:
            # formatos comunes tipo "2025-Nov-30 02:18"
            return abs((datetime.strptime(ds, "%Y-%b-%d %H:%M") - datetime.utcnow()).total_seconds())
        except Exception:
            try:
                return abs((datetime.strptime(ds, "%Y-%m-%d") - datetime.utcnow()).total_seconds())
            except Exception:
                return float("inf")

    earth.sort(key=key_fn)
    return earth[0]

# -------------------------
# Llamadas a tu backend
# -------------------------
def get_recent_neos() -> List[Dict[str, Any]]:
    url = f"{API_BASE}/recent_neos"
    r = requests.get(url, timeout=20)
    r.raise_for_status()
    data = r.json()
    # El backend devuelve lista directa de NEOs
    return data if isinstance(data, list) else []

def get_neo_detail(neo_id: str) -> Dict[str, Any]:
    url = f"{API_BASE}/neo/"
    r = requests.get(url, params={"neo_id": neo_id}, timeout=20)
    r.raise_for_status()
    return r.json()

# -------------------------
# Riesgo heurístico
# -------------------------
def risk_score(
    energy_Mt: Optional[float],
    miss_km: Optional[float],
    is_hazardous: bool
) -> Tuple[str, float]:
    """
    Devuelve (nivel, score_float). Score mayor = peor.
    Heurística simple combinando energía y distancia mínima.
    """
    if energy_Mt is None or miss_km is None:
        base = 0.0
    else:
        # normaliza: energía en escala log y distancia en inversa
        energy_term = math.log10(max(energy_Mt, 1e-6))  # evita -inf
        dist_term = 1e6 / max(miss_km, 1.0)             # <= 1 si miss > 1e6 km
        base = energy_term + dist_term

    if is_hazardous:
        base += 0.75

    # umbrales ajustables
    if base >= 7.0:
        return ("critico", base)
    elif base >= 5.0:
        return ("alto", base)
    elif base >= 3.0:
        return ("medio", base)
    else:
        return ("bajo", base)

# -------------------------
# Pipeline de análisis
# -------------------------
def analyze(limit: int = 10, hazard_only: bool = False) -> List[Dict[str, Any]]:
    rows = []
    neos = get_recent_neos()
    if hazard_only:
        neos = [n for n in neos if n.get("is_potentially_hazardous_asteroid")]

    count = 0
    for neo in neos:
        if limit and count >= limit:
            break
        neo_id = neo.get("id")
        if not neo_id:
            continue

        try:
            detail = get_neo_detail(neo_id)
        except Exception as e:
            print(f"[WARN] fallo al consultar detalle {neo_id}: {e}", file=sys.stderr)
            continue

        km = (detail.get("estimated_diameter", {}) or {}).get("kilometers", {})
        dmin = to_float(km.get("estimated_diameter_min"))
        dmax = to_float(km.get("estimated_diameter_max"))

        ca = pick_earth_approach(detail.get("close_approach_data", []) or [])
        rv_kps = to_float(((ca or {}).get("relative_velocity") or {}).get("kilometers_per_second"))
        miss_km = to_float(((ca or {}).get("miss_distance") or {}).get("kilometers"))

        mass_kg, energy_J, energy_Mt = est_mass_energy(dmin, dmax, rv_kps)

        level, score = risk_score(energy_Mt, miss_km, bool(detail.get("is_potentially_hazardous_asteroid")))

        row = {
            "id": detail.get("id"),
            "name": detail.get("name"),
            "H": to_float(detail.get("absolute_magnitude_h")),
            "diameter_km_min": dmin if dmin else None,
            "diameter_km_max": dmax if dmax else None,
            "hazardous": bool(detail.get("is_potentially_hazardous_asteroid")),
            "approach_when": (ca or {}).get("close_approach_date_full") or (ca or {}).get("close_approach_date"),
            "rel_velocity_kps": rv_kps if rv_kps else None,
            "miss_distance_km": miss_km if miss_km else None,
            "mass_est_kg": mass_kg if mass_kg else None,
            "energy_J": energy_J if energy_J else None,
            "energy_MtTNT": energy_Mt if energy_Mt else None,
            "risk_level": level,
            "risk_score": round(score, 3),
            # orbital snapshot útil para UI/Fase 2
            "orbit": {
                "a_AU": to_float((detail.get("orbital_data") or {}).get("semi_major_axis")),
                "e": to_float((detail.get("orbital_data") or {}).get("eccentricity")),
                "i_deg": to_float((detail.get("orbital_data") or {}).get("inclination")),
            }
        }
        rows.append(row)
        count += 1

    # Ordena por score (descendente)
    rows.sort(key=lambda r: r.get("risk_score", 0.0), reverse=True)
    return rows

# -------------------------
# Exportadores
# -------------------------
def save_json(rows: List[Dict[str, Any]], path: str) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"generated_at": datetime.utcnow().isoformat()+"Z", "items": rows}, f, ensure_ascii=False, indent=2)

def save_csv(rows: List[Dict[str, Any]], path: str) -> None:
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    fields = [
        "id","name","H","diameter_km_min","diameter_km_max","hazardous",
        "approach_when","rel_velocity_kps","miss_distance_km",
        "mass_est_kg","energy_J","energy_MtTNT","risk_level","risk_score"
    ]
    with open(path, "w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for r in rows:
            w.writerow({k: r.get(k) for k in fields})

# -------------------------
# CLI
# -------------------------
def main():
    parser = argparse.ArgumentParser(description="Meteor Madness – Fase 1 Analyzer (real asteroids)")
    parser.add_argument("--limit", type=int, default=10, help="Máximo de NEOs a analizar (def: 10)")
    parser.add_argument("--hazard-only", action="store_true", help="Solo NEOs marcados como potencialmente peligrosos")
    parser.add_argument("--save-json", type=str, default=None, help="Ruta para exportar JSON (opc.)")
    parser.add_argument("--save-csv", type=str, default=None, help="Ruta para exportar CSV (opc.)")
    parser.add_argument("--density", type=float, default=DENSITY_KG_M3_DEFAULT, help="Densidad kg/m3 usada en estimación (def: 3000)")
    parser.add_argument("--api-base", type=str, default=API_BASE, help="Base URL del backend (def: http://127.0.0.1:6789)")
    args = parser.parse_args()

    # Permitir override por CLI
    global API_BASE
    API_BASE = args.api_base
    global DENSITY_KG_M3_DEFAULT
    DENSITY_KG_M3_DEFAULT = args.density

    rows = analyze(limit=args.limit, hazard_only=args.hazard_only)

    # Print tabla corta a consola
    print(f"\nAnálisis NEOs (top {min(args.limit, len(rows))}):\n")
    print(f"{'ID':>10}  {'Name':<22}  {'Risk':<7}  {'Score':>6}  {'Mt TNT':>10}  {'Miss km':>12}  {'v km/s':>7}")
    print("-" * 80)
    for r in rows:
        print(f"{r['id']:>10}  {r['name']:<22}  {r['risk_level']:<7}  {r['risk_score']:>6.2f}  "
              f"{(r['energy_MtTNT'] or 0):>10.2f}  {(r['miss_distance_km'] or 0):>12,.0f}  {(r['rel_velocity_kps'] or 0):>7.2f}")

    # Exports
    if args.save_json:
        save_json(rows, args.save_json)
        print(f"\n✅ JSON guardado en: {args.save_json}")
    if args.save_csv:
        save_csv(rows, args.save_csv)
        print(f"✅ CSV guardado en:  {args.save_csv}")

if __name__ == "__main__":
    main()
