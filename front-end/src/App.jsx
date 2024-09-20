
import './App.css'
import { useRecoilValue } from 'recoil'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import userAtom from './atoms/userAtom'
import { Box, Container } from '@chakra-ui/react'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import Header from './components/Header'
import UpdateProfilePage from './pages/UpdateProfilePage'
import UserPage from './pages/UserPage'
import CreatePost from './components/CreatePost'
import PostPage from './pages/PostPage'
import { SettingsPage } from './pages/SettingPage'

function App() {
console.log("render app")
  const user = useRecoilValue(userAtom);
  console.log(user)
	const { pathname } = useLocation();
  return (
    <Box position={"relative"} w='full'>
    <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
      <Header />
      <Routes>
      <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />
      <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
      <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />
      <Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
                <>
                <UserPage />
              
              </>

							)
						}
					/>
     <Route path='/:username/post/:pid' element={<PostPage />} />
     <Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />

      </Routes>
    </Container>
  </Box>
  )
}

export default App
