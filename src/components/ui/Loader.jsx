export default function Loader({ fullScreen }) {
  return (
    <div
      className="dic-loader"
      style={fullScreen ? { minHeight: "60vh" } : undefined}
    >
      <span className="dic-spinner" aria-hidden="true" />
      <span>Chargement...</span>
    </div>
  );
}