/**
 * Git Commit Validator
 * Copyright (C) 2025 Sebastian Guerra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License v3.0.
 * See LICENSE file or https://www.gnu.org/licenses/gpl-3.0.html
 */

const { main } = require('./cli');

module.exports = {
  install: main,
  version: require('./package.json').version,
};
