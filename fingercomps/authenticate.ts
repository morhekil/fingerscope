import { Session } from "./types";

const path =
  "https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel";
const method = "POST";

const query = {
  database: "projects/fingercomps-lite-au/databases/(default)",
  VER: "8",
  RID: "3754",
  CVER: "22",
  "X-HTTP-Session-Id": "gsessionid",
  $httpHeaders: "X-Goog-Api-Client:gl-js/ fire/7.19.1",
  "Content-Type": "text/plain",
  t: "1",
};

const reqData = (compId: string) => ({
  database: "projects/fingercomps-lite-au/databases/(default)",
  addTarget: {
    documents: {
      documents: [
        `projects/fingercomps-lite-au/databases/(default)/documents/competitions/${compId}`,
      ],
    },
    targetId: "2",
  },
});

const payload = (compId: string) => ({
  count: "1",
  ofs: "0",
  req0___data__: JSON.stringify(reqData(compId)),
});

const authenticate = async (compId: string): Promise<Session> => {
  // send request to firestore with payload serialized as x-www-form-urlencoded
  const res = await fetch(`${path}?${new URLSearchParams(query)}`, {
    method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(payload(compId)),
  });
  const response = await res.text();
  const dataline = JSON.parse(response.split("\n")[1].toString());
  const SID = dataline[0][1][1].toString();
  const gsessionid = res.headers.get("X-HTTP-Session-Id") || "";

  return { gsessionid, SID };
};

export default authenticate;
