# Prototype for Appointments app

## Made using meteor.js
To run, check out the repository. In the root directory of the project, run `meteor`. This should install the latest version of meteor and all the dependencies listed in `package.json` and start the project to view at `localhost:3000`.

## Testing
There is one test file, `main.spec.js`, with three sample tests of the UI. To run tests, run `meteor test --driver-package practicalmeteor:mocha --port 3100` in another tab of the terminal (so that you can have both the application and the result of the tests). Now you can have the app running at `localhost:3000` and the test result at `localhost:3100`.

## Known issues / bugs
Some of the features could be implemented, some are known / potential bugs

- hours array assumes we only want to have times for today from 7am till 6pm.
- hours array has only whole hours, so the complicated calculation is needed to check for half hours
- there is no validation for start and end for appointments (start should be earlier than end)
- there is no click handler for placing a new appointment (well, the event is caught, but nothing happens with it)
- the test for date string is a hardcoded value, so if you test on 31st of August, this test will fail
- there are no tests for server-side code (creating and storing the `Appointments` collection)
- text concatenation for appointment description is deleted as not elegant enough (hackathon mode), so now it's just clipped (ugly!)
- there are no animations for e.g. deleting an appointment or adding a new one
- drag is not implemented (edit time by dragging an item) 
