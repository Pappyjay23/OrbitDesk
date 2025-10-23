import { BrowserRouter, Route, Routes } from "react-router-dom";
import RouteGuard from "./components/RouteGuard";
import ThemeToggle from "./components/ui/ThemeToggle";
import routes, { type AppRoute } from "./routes";

const renderRoute = (route: AppRoute) => {
	const element = route.protected ? (
		<RouteGuard>{route.element}</RouteGuard>
	) : (
		route.element
	);

	if (!route.children || route.children.length === 0) {
		return <Route key={route.path} path={route.path} element={element} />;
	}

	// has nested children
	return (
		<Route key={route.path} path={route.path} element={element}>
			{route.children.map((child) => renderRoute(child))}
		</Route>
	);
};

const App = () => {
	return (
		<div className='bg-background text-foreground relative'>
			<div className='fixed right-6 bottom-8 z-50'>
				<ThemeToggle />
			</div>
			{/* Hidden image to force caching */}
			<img
				src='/offline-bg.jpg'
				alt=''
				width={1}
				height={1}
				style={{ display: "none" }}
			/>
			<BrowserRouter>
				<Routes>{routes.map((r) => renderRoute(r))}</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
