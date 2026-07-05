# On-device AI GGUF model

Place the on-device AI model here for local development, or provide `AI_MODEL_URL` in EAS for production builds.

Local filename:

```text
ai-model.gguf
```

Model requirements:

- GGUF format compatible with `llama.rn`
- Size: at least 500 MB for the production model check
- License: confirm redistribution and app use before release

The app never calls a cloud LLM. If this model file is absent, smaller than 500 MB, or fails to load, the consultation flow falls back to supervised templates.
