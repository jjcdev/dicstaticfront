export default function Loader({ fullScreen }) {
  return (
    <div
      className="adm-loader"
      style={fullScreen ? { minHeight: "100vh" } : undefined}
    >
      <span className="adm-spinner" aria-hidden="true" />
      <span>Chargement...</span>
    </div>
  );
}