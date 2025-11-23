# Exercise 4: API Testing Results & Morgan Logging

**Date:** November 23, 2025  
**Student:** Ayman El Mhallaoui  
**Repository:** https://github.com/Olenayman/backend-week2

---

## 1. Morgan Logging Configuration

### Implementation:
```javascript
const morgan = require('morgan');
app.use(morgan('dev'));