import {
  AbsoluteFill,
  Audio,
  Composition,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const MyComposition = () => {
  return (
    <Composition
      id="TestClip"
      component={TestClip}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

const Block: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - index * 12, fps, config: { damping: 12 } });
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {index > 0 && (
        <div
          style={{
            width: 50 * pop,
            height: 6,
            background: "#f7931a",
            opacity: pop,
          }}
        />
      )}
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: 20,
          border: "5px solid #f7931a",
          background: "#1e293b",
          color: "white",
          fontSize: 32,
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${pop})`,
        }}
      >
        #{index + 1}
      </div>
    </div>
  );
};

export const TestClip: React.FC = () => {
  const frame = useCurrentFrame();
  const textOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Segoe UI, Helvetica, Arial, sans-serif",
      }}
    >
      <Sequence from={10}>
        <Audio src={staticFile("test.wav")} />
      </Sequence>
      <div style={{ display: "flex" }}>
        {[0, 1, 2, 3].map((i) => (
          <Block key={i} index={i} />
        ))}
      </div>
      <div
        style={{
          marginTop: 60,
          color: "white",
          fontSize: 48,
          fontWeight: 600,
          opacity: textOpacity,
        }}
      >
        A shared ledger no one controls
      </div>
    </AbsoluteFill>
  );
};
