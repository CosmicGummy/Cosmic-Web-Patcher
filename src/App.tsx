import { useAtom } from "jotai";
import { match } from "ts-pattern";
import { screenAtom } from "./state";
import { UploadScreen } from "./screens/uploadScreen";
import { PatchScreen } from "./screens/patchScreen";
import { UnsupportedScreen } from "./screens/unsupportedScreen";

export default function App() {
  const [screen] = useAtom(screenAtom);

  return match(screen)
    .with("uploadScreen", () => <UploadScreen />)
    .with("patchScreen", () => <PatchScreen />)
    .with("unsupportedScreen", () => <UnsupportedScreen />)
    .exhaustive();
}
