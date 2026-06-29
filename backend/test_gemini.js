const keys = [
  "AIzaSyC2tAYeideqYK9BQ8wIf1D2LFWGJQf6Q1Y",
  "AQ.Ab8RN6KbjxV8Hen-uKDmStFQuim8xo9VMWBP9Zeo1BsyhJiDLg"
];

async function checkKeys() {
  for (let key of keys) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    try {
      let r = await fetch(url);
      let json = await r.json();
      if (json.error) {
        console.log(`Key ${key.substring(0, 10)}...: FAILED - ${json.error.message}`);
      } else {
        console.log(`Key ${key.substring(0, 10)}...: SUCCESS`);
      }
    } catch (e) {
      console.log(`Key ${key.substring(0, 10)}...: ERROR - ${e.message}`);
    }
  }
}

checkKeys();
