import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/layout";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const [active, setActive] = useState("eat");
  const [dishName, setDishName] = useState("");
  const [dishUrl, setDishUrl] = useState("");
  const [posted, setPosted] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);  
  const user = useUser();

  const {mutate, isLoading: isPosting} = api.dish.create.useMutation({
    onSuccess: () => {
      setPosted(true);
      setDishName("");
      setDishUrl("");
      setTimeout(() => {
        setPosted(false);
      }, 2500);
    }, onError: (e) => {
      setError(true);
      toast.error(e.message, {
        style: {
          backgroundColor: "#1f2937",
          color: "white",
          borderRadius: "8px"
        }
      });

      setTimeout(() => {
        setError(false)
      }, 2500);
    }
  });

  const {data, fetchNextPage, isLoading} = api.dish.getDishesByUserId.useInfiniteQuery(
    {
      limit: 8,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const handleFetchNextPage = async () => {
    await fetchNextPage();

    if (data?.pages[page]?.nextCursor === undefined) {
      setPage((prev) => prev - 1);
    } else {
      setPage((prev) => prev + 1);
    }
  };

  if (isLoading) return <LoadingPage/>

  if (!user) return null;

  return (
    <>
      <PageLayout>
        <div className="grow overflow-hidden w-11/12 max-w-2xl">
          {active === "eat" && 
            <div className="grid grid-cols-2 auto-rows-fr h-full gap-4 pt-6 pb-4">
              {data?.pages[page]?.dishes.map((dish) => (
                <Link href={`/${dish.id}`}>
                  <Card {...dish} key={dish.id} />
                </Link>
              ))}
            </div>
          }

          {active === "add" && 
            <div className="flex flex-col justify-end h-full items-center">
              <div className="input-wrapper">
                <input id="nameInput" 
                className="peer input" 
                value={dishName} 
                placeholder=" " 
                onChange={(e) => setDishName(e.target.value)}
                readOnly={isPosting}/>
                <label className="input-label before:content[' '] after:content[' ']">
                  Gerichtname
                </label>
              </div>
            
              <div className="input-wrapper">
                <input id="urlInput" 
                className="peer input" 
                value={dishUrl} 
                placeholder=" " 
                onChange={(e) => setDishUrl(e.target.value)}
                readOnly={isPosting}
                />
                <label className="input-label before:content[' '] after:content[' ']">
                  Bild URL
                </label>
              </div>

              {(!isPosting && !posted && !error) && 
                <button className="submit-button mb-6" 
                onClick={() => mutate({name: dishName, url: dishUrl})}>
                  Speichern
                </button>
              }
              {isPosting && 
                <button className="submit-button py-1 mb-6" 
                disabled={isPosting}>
                  {<LoadingSpinner size={28}/>}
                </button>
              }
              {posted && 
                <button className="submit-button bg-green-600 hover:shadow-green-500/40 shadow-blue-500/20 text-2xl py-1 mb-6" 
                disabled={isPosting}>
                  ✅
                </button>
              }
              {error && 
                <button className="submit-button bg-red-700 hover:shadow-red-600/40 shadow-red-500/20 text-2xl py-1 mb-6" 
                disabled={isPosting}>
                  ❌
                </button>
              }
            </div>
          }
        </div>

        {active === "eat" && 
        <div className="w-fit m-auto p-2 hover:rotate-180 active:scale-95 transition-all duration-200">
          <a className="text-2xl cursor-pointer" onClick={() => void handleFetchNextPage()}>🔄</a>
        </div>}

        <div className="flex flex-row items-center w-full order-last">
          <div className="m-auto">
            {user.isSignedIn && 
              <div className="flex flex-initial flex-row gap-6 text-right border-t-4 border-t-gray-800 pt-2">
                <div className={active === "eat" ? "menu-entry text-primary" : "menu-entry"}><a onClick={() => setActive("eat")}>Food</a></div>
                <div className={active === "history" ? "menu-entry text-primary" : "menu-entry"}><a onClick={() => setActive("history")}>Help</a></div>
                <div className={active === "add" ? "menu-entry text-primary pb-0" : "menu-entry pb-0"}><a onClick={() => setActive("add")}>Add</a></div>
                <div className="menu-entry">{<SignOutButton/>}</div>
              </div>
            }
            {!user.isSignedIn && 
              <div className="flex flex-initial flex-row gap-6 text-right border-t-4 pt-2">
                <div className="menu-entry text-primary"><a>Beispiel</a></div>
                <div className="menu-entry">{<SignInButton/>}</div>
              </div>
            }
          </div> 
        </div>

      </PageLayout>
    </>
  );
};

export default Home;
