
export default {
  fetch(req, env, ctx) {
    console.time("a");
    console.timeEnd("a");
    return Response.json({hi: `there`});
  }
}
