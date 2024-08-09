import connection from "../../connectionDB/connection.js";
import * as routers from "./index.routes.js";

export const initApp = (app, express) => {
  const port = 3000;

  connection();

  app.use(express.json());
  app.use("/users", routers.userRouter);
  app.use("/categories", routers.categoryRouter);
  app.use("/subCategory", routers.subCategoryRouter);
  app.use("/brands", routers.brandRouter);
  app.use("/products",routers.productRouter)

  app.use("*", (req, res, next) => {
    const err = new AppError(`Invalid URL ${req.originalUrl}`, 404);
    next(err);
  });
  //====================GlobalErrorHanding=======================//
  app.use(routers.globalErrorHandling);

  app.listen(port, () => console.log(`listening on port ${port}!`));
};
