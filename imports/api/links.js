import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { Random } from "meteor/random";

export const LinksCollection = new Mongo.Collection("links");

export async function insertLink(link) {
  await LinksCollection.insertAsync({ ...link, updatedAt: new Date(), createdAt: new Date() });
}
Meteor.methods({
  addLink: async function ({
    title = `Discussions ${Random.id()}`,
    url = "https://forums.meteor.com",
    enabled = false,
  } = {}) {
    await insertLink({
      title,
      url,
      enabled,
    });
  },
  toggleLinkById: async function ({ _id, enabled } = {}) {
    await LinksCollection.updateAsync(_id, {
      $set: { updatedAt: new Date(), enabled },
    });
  },
  toggleLinkByTitle: async function ({ title, enabled } = {}) {
    await LinksCollection.updateAsync(
      { title },
      { $set: { updatedAt: new Date(), enabled } },
    );
  },
  deleteLinkByTitle: async function ({ title } = {}) {
    await LinksCollection.removeAsync({ title });
  },
  toggleAllLinks: async function ({  enabled } = {}) {
    await LinksCollection.updateAsync(
      {},
      { $set: { updatedAt: new Date(), enabled } },
      { multi: true },
    );
  },
});
