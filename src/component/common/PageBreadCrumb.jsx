import { Link, useLocation } from "react-router-dom";

const PageBreadcrumb = ({ pageTitle, homePath }) => {
  const location = useLocation();
  const base =
    homePath ||
    (location.pathname.startsWith("/admin-dashboard")
      ? "/admin-dashboard"
      : "/user-dashboard");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <h2 className="text-xl font-semibold text-color-text">{pageTitle}</h2>
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm opacity-70 hover:opacity-100 transition-opacity"
              to={base}
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm font-medium text-highlight" aria-current="page">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
