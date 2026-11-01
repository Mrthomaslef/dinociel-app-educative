#!/usr/bin/env python3
"""
Script de génération de Petit Dino en dessin 2D via l'API Higgsfield (https://api.higgsfield.ai).
Usage :
  export HIGGSFIELD_API_KEY="votre_key_id:votre_key_secret"
  python3 scripts/higgsfield_generate_2d.py
"""
import json
import os
import sys
import time
import urllib.error
import urllib.request

API_BASE = "https://api.higgsfield.ai"
IMAGE_MODEL_PATH = "/higgsfield-ai/soul/v2/standard"

PROMPTS_2D = {
    "dino-idle.jpg": (
        "Flat 2D hand-drawn cartoon illustration of a cute friendly baby green dinosaur mascot "
        "for a 3-year-old kids educational app, classic 2D children's picture book drawing style, "
        "clean dark green ink outlines, flat pastel lime green and soft yellow belly colors, NOT 3D, "
        "big expressive cartoon eyes, cheerful smile, waving one little hand, pure white and soft sky-blue background"
    ),
    "dino-celebrate.jpg": (
        "Flat 2D hand-drawn cartoon illustration of a cute baby green dinosaur jumping in the air "
        "with both arms raised in celebration, big happy laughing smile, surrounded by flat 2D drawn "
        "yellow stars and colorful confetti on a white and sky-blue cloud background, NOT 3D"
    ),
    "dino-encourage.jpg": (
        "Flat 2D hand-drawn cartoon illustration of a cute baby green dinosaur with a gentle curious "
        "thinking and encouraging expression, head slightly tilted, one little hand touching his chin "
        "and the other giving a thumbs up, on a white and sky-blue cloud background, NOT 3D"
    ),
}


def generate_image(api_key: str, prompt: str) -> str:
    headers = {
        "Authorization": f"Key {api_key}" if not api_key.lower().startswith("key ") else api_key,
        "Content-Type": "application/json",
        "User-Agent": "DinoCiel/1.0",
    }
    req = urllib.request.Request(
        f"{API_BASE}{IMAGE_MODEL_PATH}",
        data=json.dumps({"prompt": prompt}).encode("utf-8"),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    status_url = data.get("status_url") or f"{API_BASE}/requests/{data['request_id']}/status"
    while True:
        time.sleep(3)
        poll_req = urllib.request.Request(status_url, headers=headers, method="GET")
        with urllib.request.urlopen(poll_req, timeout=30) as poll_resp:
            status_data = json.loads(poll_resp.read().decode("utf-8"))
        status = status_data.get("status")
        print(f"  Statut Higgsfield : {status}")
        if status in ("completed", "succeeded"):
            images = status_data.get("images") or status_data.get("output", {}).get("images", [])
            if images:
                return images[0].get("url") if isinstance(images[0], dict) else images[0]
            raise RuntimeError(f"Réponse terminée sans URL d'image : {status_data}")
        if status in ("failed", "canceled", "error"):
            raise RuntimeError(f"Échec de génération Higgsfield : {status_data}")


def main() -> int:
    api_key = os.environ.get("HIGGSFIELD_API_KEY", "").strip()
    if not api_key:
        print("Erreur : définissez la variable d'environnement HIGGSFIELD_API_KEY='key_id:key_secret'", file=sys.stderr)
        return 1

    os.makedirs("assets", exist_ok=True)
    for filename, prompt in PROMPTS_2D.items():
        print(f"Génération de {filename} sur Higgsfield...")
        try:
            img_url = generate_image(api_key, prompt)
            out_path = os.path.join("assets", filename)
            urllib.request.urlretrieve(img_url, out_path)
            print(f"  -> Enregistré dans {out_path}")
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="replace")
            print(f"Erreur HTTP {e.code} depuis api.higgsfield.ai : {err_body}", file=sys.stderr)
            return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
