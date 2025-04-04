import {Suspense} from 'react';
import { RouterProvider } from 'react-router-dom';
import router from "./router";
import LoadingPage from "./component/Loading/Loading.tsx";
const App = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router}/>
    </Suspense>
  );
}

export default App;
