import express from "express";
import { departments, subjects } from "../db/schema";
import { and, eq, ilike, or } from "drizzle-orm/sql/expressions/conditions";
import { db } from "../db";
import { desc, getTableColumns, sql } from "drizzle-orm";
const router = express.Router();

//Get all subjects with optional search , filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);

    const offset = (currentPage - 1) * limitPerPage;
    const filterConditions = [];

    // if search query exists ,filter by name or code using ilike for case-insensitive search
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }
    //ifdepartmernt filter  exists, filter by department name using ilike for case-insensitive search
    if (department) {
      filterConditions.push(ilike(departments.name, `%${department}%`));
    }

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .execute();

    const totalCount = countResult[0]?.count ?? 0;
    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause).orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset)
     

      res.status(200).json({
        data: subjectsList,
        pagination: {
         page: currentPage,
          limit: limitPerPage,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitPerPage)
        },
      });
  } catch (err) {
    console.error(`Get /subjects err: ${err}`);
    res.status(500).json({ error: "Failed to get subjects" });
  }
});
export default router;
