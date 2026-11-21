import EnrollmentsDao from "./dao";
export default function EnrollmentRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const resolveUserId = (req, res) => {
    const { uid } = req.params;
    if (uid !== "current") {
      return uid;
    }
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return null;
    }
    return currentUser._id;
  };
  const findEnrollmentsForUser = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    res.json(dao.findEnrollmentsForUser(userId));
  };
  const findEnrollmentsForCourse = (req, res) => {
    const { cid } = req.params;
    res.json(dao.findEnrollmentsForCourse(cid));
  };
  const enrollUserInCourse = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { cid } = req.params;
    res.json(dao.enrollUserInCourse(userId, cid));
  };
  const unenrollUserFromCourse = (req, res) => {
    const userId = resolveUserId(req, res);
    if (!userId) return;
    const { cid } = req.params;
    dao.unenrollUserFromCourse(userId, cid);
    res.sendStatus(200);
  };
  app.get("/api/users/:uid/enrollments", findEnrollmentsForUser);
  app.get("/api/courses/:cid/enrollments", findEnrollmentsForCourse);
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
