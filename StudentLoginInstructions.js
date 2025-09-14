// StudentLoginInstructions.js

/*
To debug the student login issue:

1. Open your application in the browser
2. Navigate to the student login page
3. Open your browser developer console (F12 or right-click > Inspect > Console)
4. Try logging in with these valid credentials:
   - Username: o210001
   - Password: o210001raja

5. Check the console logs to see:
   - If the student is found in studentData.json
   - If the login function is being called with the correct data
   - If navigation to the dashboard is attempted

If there are errors in the console, they may provide more insight into what's failing.

Common issues:
- Navigation not working (check the router setup)
- Login function throwing an error (check the AuthContext implementation)
- LocalStorage issues (check if the browser allows localStorage)
*/