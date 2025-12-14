
interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_GOOGLE_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare var google: any;

declare module 'react-router-dom' {
  export const HashRouter: any;
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Navigate: any;
  export const Link: any;
  export const NavLink: any;
  export const Outlet: any;
  export function useNavigate(): any;
  export function useLocation(): any;
  export function useParams(): any;
  export function useSearchParams(): any;
}
