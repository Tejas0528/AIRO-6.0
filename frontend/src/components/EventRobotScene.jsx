import CharacterPortrait from "./CharacterPortrait";

/**
 * EventRobotScene — kept as a thin wrapper (same props as before: characterId,
 * height) so EventCard / EventPreviewPanel / TeamBanner didn't need to
 * change. Internally it now renders the real character art via
 * CharacterPortrait instead of a Three.js robot.
 */
export default function EventRobotScene({ characterId, height = 260 }) {
  return (
    <div style={{ height }} className="relative w-full overflow-hidden">
      <CharacterPortrait characterId={characterId} size="card" />
    </div>
  );
}
