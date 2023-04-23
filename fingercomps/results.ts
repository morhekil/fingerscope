import { Session } from "./types";

const path =
  "https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel";
const method = "GET";

const query = (session: Session) => ({
  database: "projects/fingercomps-lite-au/databases/(default)",
  gsessionid: session.gsessionid,
  VER: "8",
  RID: "rpc",
  SID: session.SID,
  CI: "0",
  AID: "0",
  TYPE: "xmlhttp",
  zx: "gd4n7wnin27r",
  t: "1",
});

const results = async (session: Session) => {
  const url = `${path}?${new URLSearchParams(query(session))}`;
  console.log("url is", url);
  const res = await fetch(url, { method: "GET" });
  const response = await res.text();
  console.log("response", response);
};

export default results;
