import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import AddAlbum from "./containers/AddAlbum";
import AddEpisode from "./containers/AddEpisode";
import Albums from "./containers/Albums";
import AlbumView from "./containers/AlbumView";
import EpisodeHome from "./containers/EpisodeHome";
import Episodes from "./containers/Episodes";
import EpisodeView from "./containers/EpisodeView";
import Login from "./containers/Login";
import NotificationCenter from "./containers/NotificationCenter";
import PrivateWrapper from "./components/HOC/privateaRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<PrivateWrapper />}>
          <Route path="/" element={<Albums />} />
        </Route>

        <Route path="/album/create" element={<PrivateWrapper />}>
          <Route path="/album/create" element={<AddAlbum />} />
        </Route>

        <Route path="/album/:albumId" element={<PrivateWrapper />}>
          <Route path="/album/:albumId" element={<AlbumView />} />
        </Route>

        <Route path="/episodes" element={<PrivateWrapper />}>
          <Route path="/episodes" element={<EpisodeHome />} />
        </Route>

        <Route path="" element={<PrivateWrapper />}>
          <Route path="/episodes/:albumId" element={<Episodes />} />
        </Route>

        <Route path="" element={<PrivateWrapper />}>
          <Route path="/episodes/:albumId" element={<Episodes />} />
        </Route>

        <Route path="" element={<PrivateWrapper />}>
          <Route path="/episode/:epiID" element={<EpisodeView />} />
        </Route>

        <Route path="" element={<PrivateWrapper />}>
          <Route path="/episode/create/:albumId" element={<AddEpisode />} />
        </Route>

        <Route path="" element={<PrivateWrapper />}>
          <Route path="/notifications" element={<NotificationCenter />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
