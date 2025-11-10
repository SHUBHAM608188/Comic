// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Gallery from "./components/Gallery";
import Project from "./components/Project";
import About from "./components/About";
import About1 from "./components/About1";
import About2 from "./components/About2";
import InfiniteSpiral from "./components/InfiniteSpiral";
import History from "./components/History";
import DefiningDestiny from "./components/DefiningDestiny";
import Read from "./components/Read";
import FeaturedComics from "./components/FeaturedComics";
import Admin from "./components/Admin";
import Dashboard from "./components/Dashboard";
import Card from "./components/Card";
import Define from "./components/Define";
import Featured from "./components/Featured";
import Cart_Check from "./components/Cart_Check";
import User from "./components/User";
import Fund from "./components/Fund";
//  Layout with Navbar + Footer (main site)
function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

//  Layout with only Footer (for admin or special pages)
function FooterOnlyLayout({ children }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin route (with only Footer) */}
        <Route
          path="/admin"
          element={
            <FooterOnlyLayout>
              <Admin />
            </FooterOnlyLayout>
          }
        />

        {/* Auth routes (no Navbar or Footer) */}
        <Route
          path="/login"
          element={
            <FooterOnlyLayout>
              <Login />
            </FooterOnlyLayout>
          }
        />

        <Route
        path="/register"
        element={
        <FooterOnlyLayout>
        <Register />
        </FooterOnlyLayout>
        }
        />

        {/* All other routes share Navbar + Footer */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/history"
          element={
            <MainLayout>
              <History />
            </MainLayout>
          }
        />
        <Route
          path="/read"
          element={
            <MainLayout>
              <Read />
            </MainLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <MainLayout>
              <Gallery />
            </MainLayout>
          }
        />
        <Route
          path="/project"
          element={
            <MainLayout>
              <Project />
            </MainLayout>
          }
        />
        <Route
          path="/about"
          element={
            <MainLayout>
              <About />
            </MainLayout>
          }
        />

                <Route
          path="/about1"
          element={
            <MainLayout>
              <About1 />
            </MainLayout>
          }
        />

           <Route
          path="/about2"
          element={
            <MainLayout>
              <About2 />
            </MainLayout>
          }
        />
        <Route
          path="/definingDestiny"
          element={
            <FooterOnlyLayout>
              <DefiningDestiny />
            </FooterOnlyLayout>
          }
        />
        <Route
          path="/infiniteSpiral"
          element={
            <FooterOnlyLayout>
              <InfiniteSpiral />
            </FooterOnlyLayout>
          }
        />
        <Route
          path="/featuredComics"
          element={
            <MainLayout>
              <FeaturedComics />
            </MainLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <FooterOnlyLayout>
              <Dashboard />
            </FooterOnlyLayout>
          }
        />
        <Route
          path="/card"
          element={
            <MainLayout>
              <Card />
            </MainLayout>
          }
        />
                <Route
          path="/define"
          element={
            <FooterOnlyLayout>
              <Define />
            </FooterOnlyLayout>
          }
        />
                <Route
          path="/featured"
          element={
            <FooterOnlyLayout>
              <Featured />
            </FooterOnlyLayout>
          }
        />

        <Route
        path="/cart_Check"
        element={
        <FooterOnlyLayout>
        <Cart_Check />
        </FooterOnlyLayout>
        }
        />

        <Route
        path="/User"
        element={
        <FooterOnlyLayout>
        <User />
        </FooterOnlyLayout>
        }
        />

        <Route
        path="/Fund"
        element={
        <FooterOnlyLayout>
        <Fund />
        </FooterOnlyLayout>
        }
        />

      </Routes>
    </Router>
  );
}

export default App;
