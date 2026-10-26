# Phase 3 verification

Sahith Thopucherla · st944@njit.edu · October 26, 2026
IT-302 Advanced Internet Applications, Section 451
Phase 3 CUD MongoDB Data using Node.js

- JavaScript syntax checks passed.
- Five Node tests passed, including an isolated real MongoDB comment lifecycle integration test.
- Seven Postman CLI requests succeeded locally and against Render; five assertions passed in each run. See `postman-local.txt` and `postman-render.txt`.
- Render health endpoint returned HTTP 200 and `{"status":"ok"}`.
- Production dependency audit: zero known vulnerabilities.
- The Postman desktop application successfully created, updated, and deleted the same comment against Render. POST returned 201; PUT and DELETE returned 200. The timestamps in the POST and PUT screenshots differ, confirming lastModified was refreshed.
- Three unmodified Postman application screenshots were packaged in `IT302-Phase3-Postman-Screenshots.zip` for the Canvas attachment. The ZIP is kept outside Git.
- Final JSON was exported from Atlas after testing: 25 original observations and one persistent realistic sample comment. Both temporary test comments were deleted by their respective tests.
- Atlas credentials are excluded from Git; Render stores its connection string as an environment secret.

Render URL: https://st944-it302-observations-backend.onrender.com
GitHub tag: https://github.com/Bazing89/IT302-st944-ProjectBackend/tree/IT302-Phase3

Canvas submission consists of the GitHub tag URL, Render URL, and screenshot ZIP attachment.
