import { NextResponse } from "next/server";


const keys= [
        {
            "kty": "RSA",
            "e": "AQAB",
            "kid": "1729",
	    "use":"sig",
           "alg":"RS256",
            "n": "yZq1k09PdsU7LzYHp-NxS6O72bEFiGEPCjQ0S9BmMuf_TGpgo8L99hVIB9mB3HjzIZJmYAp-X9IOQUf2DKJHE2C-sZxttUGl7_zzDUI7c7YeyPujRbCt4WrdqOELPOlyf5MvYqodgzBTMrlSnP5bJ2ynxjlxN763It0aGlgOMwb_DGtZtSeU51Nkzcbqkhl9fZXJSY9Qe4CItimU-lxpcG5Ite3fV1svVR2ZgGoFjDBiRQ5iD5nOzc3iDV2zt1AnIw4v9EejgETOPzeBb39G4IKzineiyKoSSBAJ5wIdfTvdz8tHviIjE0evHJ2EdfT35HN2aNjo6N8seHuoV4a9jQ"
        }
    ]

    


export async function GET(req:Request) {
 
    // Return the JSON data as a response
   return NextResponse.json({mykeys:keys }, { status: 201 ,headers: { 'Content-Type': 'application/json' }});
  
}
