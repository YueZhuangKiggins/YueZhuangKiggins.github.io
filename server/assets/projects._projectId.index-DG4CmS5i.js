import { V as jsxRuntimeExports } from "./server-CsSHuzdL.js";
import { b as Route, N as Navigate } from "./router-ClubPYl5.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const SplitComponent = () => {
  const {
    projectId
  } = Route.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/projects/$projectId/$tab", params: {
    projectId,
    tab: "pico"
  }, replace: true });
};
export {
  SplitComponent as component
};
