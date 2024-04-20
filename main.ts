import { search } from "./search/search";
import { getVQD } from "./search/base";

getVQD('大语言模型').then(console.log).catch(console.error);

// search('大语言模型微调').then(console.log).catch(console.error);