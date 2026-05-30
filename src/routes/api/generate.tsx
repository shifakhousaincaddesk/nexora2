import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { GenerationController } from "../../../server/controllers/generationController";

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        return await GenerationController.handleGenerate(request);
      },
    },
  },
});
