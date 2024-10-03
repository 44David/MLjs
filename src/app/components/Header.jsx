async function fetchWithFirebaseHeaders(request) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const installations = getInstallations(app);
    const headers = new Headers(request.headers);
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);
    headers.append("Firebase-Instance-ID-Token", installationToken);
    if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
    const newRequest = new Request(request, { headers });
    return await fetch(newRequest);
  }
  
  async function getAuthIdToken(auth) {
    await auth.authStateReady();
    if (!auth.currentUser) return;
    return await getIdToken(auth.currentUser);
  }

  export default function Header({initialUser}) {
        const user = useUserSession(initialUser)

        const handleSignOut = event => {
                event.preventDefault();
                signOut()
        };

        const handleSignIn = event => {
                event.preventDefault()
                signInWithGoogle()
        };

  }

  function useUserSession(initialUser) {
    // The initialUser comes from the server via a server component
    const [user, setUser] = useState(initialUser);
    const router = useRouter();

    // Register the service worker that sends auth state back to server
    // The service worker is built with npm run build-service-worker
    useEffect(() => {
            if ("serviceWorker" in navigator) {
                    const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig));
                    const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`
            
              navigator.serviceWorker
                    .register(serviceWorkerUrl)
                    .then((registration) => console.log("scope is: ", registration.scope));
            }
      }, []);

    useEffect(() => {
            const unsubscribe = onAuthStateChanged((authUser) => {
                    setUser(authUser)
            })

            return () => unsubscribe()
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
            onAuthStateChanged((authUser) => {
                    if (user === undefined) return

                    // refresh when user changed to ease testing
                    if (user?.email !== authUser?.email) {
                            router.refresh()
                    }
            })
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return user;
}
