type MessagePayload = {
  phone: string;
  message: string;
};

function isMessagePayload(value: unknown): value is MessagePayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "phone" in value &&
    typeof value.phone === "string" &&
    value.phone.length <= 40 &&
    "message" in value &&
    typeof value.message === "string" &&
    value.message.trim().length > 0
  );
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Le formulaire envoyé est invalide." }, { status: 400 });
  }

  if (!isMessagePayload(payload)) {
    return Response.json(
      { error: "Ajoute un message avant de l’envoyer." },
      { status: 400 },
    );
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  if (!scriptUrl) {
    return Response.json(
      { error: "Le formulaire n’est pas encore connecté à son tableau de réponses." },
      { status: 503 },
    );
  }

  let response: Response;
  try {
    response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return Response.json(
      { error: "Le service de réponses est momentanément inaccessible. Réessaie plus tard." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return Response.json(
      { error: "Le message n’a pas pu être enregistré. Réessaie dans un instant." },
      { status: 502 },
    );
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    return Response.json(
      { error: "Le service de réponses a renvoyé une réponse invalide." },
      { status: 502 },
    );
  }

  if (typeof result !== "object" || result === null || !("ok" in result) || result.ok !== true) {
    return Response.json(
      { error: "Le message n’a pas pu être enregistré. Réessaie dans un instant." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
