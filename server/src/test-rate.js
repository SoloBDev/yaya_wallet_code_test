// test-rate.js
import axios from "axios";

const URL = "http://localhost:8000/api/transactions";

async function run() {
  for (let i = 1; i <= 20; i++) {
    try {
      const r = await axios.get(URL);
      console.log(i, r.status, r.headers['ratelimit-remaining'] ?? '-');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.log(i, err.response.status, err.response.data || err.response.headers);
      } else if (err instanceof Error) {
        console.log(i, "ERR", err.message);
      } else {
        console.log(i, "ERR", String(err));
      }
    }
  }
}

run();
