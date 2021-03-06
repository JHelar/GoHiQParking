# GoHiQParking
Parking webb app and REST Api.

# ApiDescription
HiQParking API

##General:

	Results from calls will result in this structure:
		{
			error (bool),
			message (string),
			data: --result data--
		}
	Calls will go through an authorization handler, that checks if user exist / is allowed. Results will wary on the sessionkey provided in a cookie or in json data, can be omited too.
	Calls are formed by: CONTROLLER_NAME + MTHOD_NAME (example: "/api/spot/getAll")

##Controllers:

###User (/api/user):

	register (/register):
		desc:
			Tries to create a new user, with provided information.
			Creates a new sessionkey for the user.
		in: 
			{
				username (string),
				email (string),
				password (string)
			}
		out:
			{
				error (bool),
				message (string),
				data: {
					sessionkey (string)
				}
			}
	login (/login):
		desc:
			Tries to log in a user, with provided information.
			Creates a new session for the user.
		in:
			{
				usernameemail (string),		//A user name or an email
				password (string)
			}
		out:
			{
				error (bool),
				message (string),
				data: {
					sessionkey (string)
				}
			}
	logout (/logout):
		desc:
			Tries to log the current user out, removing the validity of the sessionkey,
		in:
			{
				sessionkey (string)
			}
		out:
			{
				error (bool),
				message (string),
				data: {
					success (string)
				}
			}
	get (/get):
		desc:
			Returns the userobject that is corresponding to the given sessionkey.
		in:
			{
				sessionkey (string)
			}
		out:
			{
				error (bool),
				message (string),
				data: {
					username (string)
				}
			}
###Spot (/api/spot):

	getAll (/getAll):
		desc:
			Returns all parkingspots, if user is logged in spots returned will contain a extra modify field.
		in:
			{
				sessionkey (string)
			}
		out:
			{
				error (bool),
				message (string),
				data: [
					{
						id (int),
						name (string),
						isparked (bool),
						parkedby (string), //Omited if not parked
						parkedtime (string), //Timestring in RFC3339 format, omited if not parked.
						canmodify (bool), //If current user is allowed to modify the field.
					}
				]
			}
	get (/get):
		desc:
			Tries to return a given spot.
		in: 
			{
				sessionkey (string),
				id (int)
			}
		out:
			{
				error (bool),
				message (string),
				data: {
					id (int),
					name (string),
					isparked (bool),
					parkedby (string), //Omited if not parked
					parkedtime (string), //Timestring in RFC3339 format, omited if not parked.
					canmodify (bool), //If current user is allowed to modify the field.
				}
			}
	toggle (/toggle):
		desc:
			Toggles a parking spot, if parked it will leave it, otherwise it will park.
		in:
			{
				sessionkey (string),
				id (int)	//ID of the spot.
			}
		out:
			{
				error (bool),
				message (string),
				data: [
					{
						id (int),
						name (string),
						isparked (bool),
						parkedby (string), //Omited if not parked
						parkedtime (string), //Timestring in RFC3339 format, omited if not parked.
						canmodify (bool), //If current user is allowed to modify the field.
					}
				]
			}````