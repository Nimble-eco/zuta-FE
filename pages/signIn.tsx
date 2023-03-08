import { getCsrfToken, getProviders, getSession, signIn } from "next-auth/react";
import { FaGoogle,
    FaTwitter,
    FaFacebook
} from "react-icons/fa";

export default function SignIn({ providers }: any) {
    const displayStyledSignInBtn = (providerName: string, providerId: string) => {
        if(providerName == "Google"){
            return (
                <div
                    className="flex flex-row items-center border border-[#DB4437] rounded-md"
                    key={providerName}
                    onClick={() => signIn(providerId)}
                >
                    <FaGoogle className="text-3xl w-[20%] text-[#DB4437] text-center "/>
                    <span 
                        className="bg-[#DB4437] w-[80%] px-5 py-3 text-lg md:text-xl"
                    >
                        Sign in with Google
                    </span>
                </div>
            )
        }
        else if(providerName.toLowerCase() === "facebook"){
            return (
                <div
                    className="flex flex-row items-center border border-[#4267B2] rounded-md"
                    key={providerName}
                    onClick={() => signIn(providerId)}
                >
                    <FaFacebook className="text-3xl w-[20%] text-[#4267B2] text-center "/>
                    <span 
                        className="bg-[#4267B2] w-[80%] px-5 py-3 text-lg md:text-xl"
                    >
                        Sign in with {providerName}
                    </span>
                </div>
            )
        }

        else if(providerName.toLowerCase() === "twitter (legacy)"){
            return (
                <div
                    className="flex flex-row items-center border border-blue-400 rounded-md"
                    key={providerName}
                    onClick={() => signIn(providerId)}
                >
                    <FaTwitter className="text-3xl w-[20%] text-[#1DA1F2] text-center "/>
                    <span 
                        className="bg-[#1DA1F2] w-[80%] px-5 py-3 text-lg md:text-xl"
                    >
                        Sign in with Twitter
                    </span>
                </div>
            )
        }
    }
  return (
    <div
        className="w-full mt-[10%]"
    >
        <h2 
            className="text-3xl my-8 font-bold text-center"
        >
            Sign into Zuta
        </h2>
        <p
            className="text-base text-orange-500 mx-auto font-semibold text-center mb-6"
        >
            Enjoy wholesale benefits when you shop from Zuta
        </p>
        <div
            className="flex flex-col font-mono text-black px-24 m-auto"
        >
            {Object.values(providers).map((provider: any, i: number) => (
                <div
                    className=" text-white font-bold px-4 mb-5 w-[70%] md:w-[50%] mx-auto cursor-pointer"
                    key={i}
                >
                    {displayStyledSignInBtn(provider.name, provider.id)}
                </div>
            ))}
        </div>
    </div>
  );
}
export async function getServerSideProps(context: any) {
    const { req } = context;
    const session = await getSession({ req });
  
    if (session) {
      return {
        redirect: { destination: "back" },
      };
    }
  
    return {
      props: {
        providers: await getProviders(),
        csrfToken: await getCsrfToken(context),
      },
    };
}
