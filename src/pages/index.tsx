import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShuffle, faUtensils, faQuestion, faPlus, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { type NextPage } from "next";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card } from "~/components/card";
import { PageLayout } from "~/components/layout";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { MenuLayout } from "~/components/menu";
import { Pill } from "~/components/pill";

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

  const {data: ingridients} = api.ingridient.getAllIngridients.useQuery();

  if (isLoading) return <LoadingPage/>

  if (!user) return null;

  return (
    <>
      <PageLayout>
        <div className="grow overflow-hidden w-11/12 max-w-2xl">
          {active === "eat" && 
            <div className="grid grid-cols-2 auto-rows-fr h-full gap-4 pt-4">
              {data?.pages[page]?.dishes.map((dish) => (
                <Link href={`/${dish.id}`} key={dish.id}>
                  <Card ingridients={[]} {...dish} key={dish.id} />
                </Link>
              ))}
            </div>
          }

          {active === "help" && 
            <div className="h-full">
              <div className="bg-red-200 w-full grid grid-cols-2 auto-rows-fr h-2/5 gap-4 pt-6 pb-4">
                <Card id={""} name={"test"} url={""} authorId={""} ingridients={[]} />
                <Card id={""} name={"test"} url={""} authorId={""} ingridients={[]} />
                <Card id={""} name={"test"} url={""} authorId={""} ingridients={[]} />
                <Card id={""} name={"test"} url={""} authorId={""} ingridients={[]} />
              </div>
              <div className="h-3/5 bg-green-300 flex flex-col-reverse">
                <div className="flex flex-row flex-wrap-reverse bg-green-200 gap-2 justify-center mt-4 mb-4">
                  {ingridients?.map((ingridient) => (
                    <Pill key={ingridient.id} name={ingridient.name}/>
                  ))}
                </div>
              </div>
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
        <div className="w-fit m-auto p-4 hover:text-primary active:scale-95 transition-all duration-200">
          <a className="text-xl cursor-pointer" onClick={() => void handleFetchNextPage()}>
            <FontAwesomeIcon icon={faShuffle} />
          </a>
        </div>}

        {user.isSignedIn && 
          <MenuLayout>
            <button className={active === "eat" ? "menu-entry before:content-[''] active" : "menu-entry"} onClick={() => setActive("eat")}>
              <FontAwesomeIcon icon={faUtensils} className="text-xl"/><br/>Food
            </button>
            <button className={active === "help" ? "menu-entry after:content-[''] active" : "menu-entry"} 
              onClick={() => setActive("help")}>
                <FontAwesomeIcon icon={faQuestion} className="text-xl"/><br/>Help
            </button>
            <button className={active === "add" ? "menu-entry after:content-[''] active" : "menu-entry"} 
              onClick={() => setActive("add")}>
                <FontAwesomeIcon icon={faPlus} className="text-xl"/><br/>Add
            </button>
            <div className="menu-entry"
              onClick={() => setActive("")}>
              <FontAwesomeIcon icon={faRightFromBracket} className="text-xl" /><br/>{<SignOutButton/>}
            </div>
          </MenuLayout>
        }
        {!user.isSignedIn && 
          <MenuLayout>
            <button className="menu-entry after:content-[''] active">
                <FontAwesomeIcon icon={faUtensils} className="text-xl"/><br/>Example
            </button>
            <div className="menu-entry">
              <FontAwesomeIcon icon={faUser} className="text-xl" /><br/>{<SignInButton/>}
            </div>
          </MenuLayout>
        }

      </PageLayout>
    </>
  );
};

export default Home;
