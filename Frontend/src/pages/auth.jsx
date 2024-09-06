import React, { useDeferredValue, useEffect, useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import axios from 'axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Auth = () => {
  const userRef = useRef();
  const errRef = useRef();
  const loginErrRef = useRef();
  const navigate = useNavigate();
  const [defaultTab, setDefaultTab] = useState('signup');

  const [username, setUsername] = useState('');
  const [validUsername, setValidUsername] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [cnfrmPassword, setCnfrmPassword] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [signupErrMsg, setSignupErrMsg] = useState();


  const [loginUsername, setLoginUsername] = useState('');
  const [loginPwd, setLoginPwd] = useState('');
  const [loginErrMsg, setLoginErrMsg] = useState('');

  // focus on username on component load
  useEffect(() => {
    if (defaultTab === "signup") {
      userRef.current.focus();
    }
  }, []);

  // check whether username matches regex
  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);

  // check whether password matches regex and password and confirm password are same or not
  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password))
    setValidMatch(password === cnfrmPassword)
  }, [password, cnfrmPassword]);

  // set err msg to empty string when any of input field is changed as user has read error message and now he is adjusting to changes.
  useEffect(() => {
    setSignupErrMsg('');
    setLoginErrMsg('');
  }, []);

  useEffect(() => {
    if (defaultTab === "signup") {
      setLoginErrMsg("");
    } else if (defaultTab === "login") {
      setSignupErrMsg("");
    }
  }, [])

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (username == '' || password == '' || name == '' || email == '' || cnfrmPassword == '') {
      setErrMsg("All fields are required!");
      return;
    }

    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password)
    if (!v1 || !v2) {
      setSignupErrMsg("Invalid Entry");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/register', { username, name, emailId: email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      console.log(response);
      if (response?.status === 201) {
        setDefaultTab("login")

        setUsername('');
        setName('');
        setEmail('');
        setPassword('');
        setCnfrmPassword('');
        setSignupErrMsg('');
      }
    } catch (error) {
      console.error(error)
      if (!error.response) {
        setSignupErrMsg("No Server Response")
      } else if (error.response?.status === 409) {
        setSignupErrMsg("Username or Email already taken")
      } else if (error.response?.status === 400) {
        setSignupErrMsg("All fields are required")
      } else if (error.response?.status === 500) {
        setSignupErrMsg("Internal Server Error!");
      } else {
        setSignupErrMsg("login failed");
      }
    }
  }


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginUsername || !loginPwd) {
      setLoginErrMsg("All Fields are required.");
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/users/login', { username: loginUsername, password: loginPwd }, {
        headers: {
          "Content-Type": "Application/json"
        }
      })
      if (response?.status === 201) {
        console.log("Login Successfull");
        navigate('/create-room')
      }
    } catch (error) {
      if (!error.response) {
        setLoginErrMsg("No Server Response")
      } else if (error.response?.status === 404) {
        setLoginErrMsg("User not found.")
      } else if (error.response?.status === 401) {
        setLoginErrMsg("Invalid user credentials")
      } else {
        setLoginErrMsg("Signup failed");
      }
    }
  }


  return (
    <section className='flex items-center h-[100vh] justify-center align-middle'>
      <Tabs value={defaultTab} onValueChange={(val) => setDefaultTab(val)} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
              <CardDescription>Enter the details to sign-up successfully.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username <span className='text-red-500'>*</span></Label>
                <Input
                  type="text"
                  id="username"
                  placeholder="Enter an username"
                  ref={userRef}
                  autoComplete="off"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  required
                  aria-invalid={validUsername ? "false" : "true"}
                  aria-describedby="uidnote"
                  onFocus={() => setUserFocus(true)}
                  onBlur={() => setUserFocus(false)}
                />
                <p id="uidnote" className={`pt-[5px] ${userFocus && username && !validUsername ? "text-[0.8rem]" : "hidden"}`}>
                  <CircleAlert />
                  4 to 24 characters.<br />
                  Must begin with a letter.<br />
                  Letters, numbers, underscores, hyphens allowed.
                </p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="name">Name<span className='text-red-500'>*</span></Label>
                <Input type="text" id="name" placeholder="Enter your name"
                  onChange={(e) => setName(e.target.value)} value={name}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emailid">Email Id<span className='text-red-500'>*</span></Label>
                <Input type="email" id="emailid" placeholder="Enter an valid email id"
                  onChange={(e) => setEmail(e.target.value)} value={email}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password<span className='text-red-500'>*</span></Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter a password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  required
                  aria-invalid={validPwd ? "false" : "true"}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => setPwdFocus(false)}
                />
              </div>
              <p id="pwdnote" className={`pt-[5px] ${pwdFocus && !validPwd ? "text-[0.8rem]" : "hidden"}`}>
                <CircleAlert />
                8 to 24 characters.<br />
                Must include uppercase and lowercase letters, a number and a special character.<br />
                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
              </p>
              <div className="space-y-1">
                <Label htmlFor="cnfrmPassword">Confirm Password<span className='text-red-500'>*</span></Label>
                <Input
                  id="cnfrmPassword"
                  placeholder="Enter your password again"
                  autoComplete="off"
                  onChange={(e) => setCnfrmPassword(e.target.value)}
                  value={cnfrmPassword}
                  required
                  aria-invalid={validMatch ? "false" : "true"}
                  aria-describedby="cnfrmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => setMatchFocus(false)}
                />
              </div>
              <p id="cnfrmnote" className={matchFocus && !validMatch ? "text-[0.8rem]" : "hidden"}>
                <CircleAlert />
                Must match the first password input field.
              </p>

            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={handleSignup}
                type='submit'
              >
                Sign Up
              </Button>
            </CardFooter>
          </Card>

          {/* LOGIN */}
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter credentials to login.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className='text-red-500'>*</span></Label>
                <Input id="username" placeholder="Enter your username"
                  onChange={(e) => setLoginUsername(e.target.value)} value={loginUsername}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password <span className='text-red-500'>*</span></Label>
                <Input id="loginPassword" placeholder="Enter your password"
                  onChange={(e) => setLoginPwd(e.target.value)} value={loginPwd}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full"
                type='submit'
                onClick={handleLogin}
              >
                Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <div className='text-center'>
          <p ref={errRef} className={signupErrMsg !== '' ? "block text-red-600" : "hidden"} aria-live="assertive">{signupErrMsg}</p>
          <p ref={loginErrRef} className={loginErrMsg !== '' ? "block text-red-600" : "hidden"} aria-live="assertive">{loginErrMsg}</p>
        </div>
      </Tabs>

    </section>
  )
}

export default Auth;
