import { search } from "./search/search";
import { getVQD } from "./search/base";


search('大语言模型微调', {
  count: 10,
}).then((res) => {
  console.log(res);
  console.log(res.results.length);
}).catch(console.error);