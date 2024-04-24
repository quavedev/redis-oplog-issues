import React from "react";
import { useFind, useSubscribe } from "meteor/react-meteor-data";
import { LinksCollection } from "../api/links";

export const Info = () => {
  const isLoading = useSubscribe("links");
  const links = useFind(() => LinksCollection.find());

  if (isLoading()) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex gap-4">
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => Meteor.call("addLink", { enabled: true })}
        >
          add
        </a>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => Meteor.call("toggleAllLinks", { enabled: true })}
        >
          enable all
        </a>
        <a
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => Meteor.call("toggleAllLinks", { enabled: false })}
        >
          disable all
        </a>
      </div>
      <ul className="mt-4">
        {links.map((link) => (
            <li key={link._id} className="flex gap-4 mt-2 items-center">
              <a
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                      Meteor.call("toggleLinkById", {
                        _id: link._id,
                        enabled: !link.enabled,
                      })
                  }
              >
                by id
              </a>
              <a
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                      Meteor.call("toggleLinkByTitle", {
                        title: link.title,
                        enabled: !link.enabled,
                      })
                  }
              >
                by title
              </a>
              <a
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() =>
                      Meteor.call("deleteLinkByTitle", {title: link.title})
                  }
              >
                remove
              </a>
              <a
                  href={link.url}
                  style={{color: link.enabled ? "blue" : "#AAA"}}
                  target="_blank"
              >
                {link.title} <span className="text-xs">({link.updatedAt?.toLocaleString() || ''})</span>
              </a>
            </li>
        ))}
      </ul>
    </div>
  );
};
