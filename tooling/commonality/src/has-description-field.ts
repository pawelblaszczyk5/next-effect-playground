import { hasPackageJsonField } from "#src/utils/has-package-json-field.js";

const hasDescriptionField = hasPackageJsonField("description");

export default hasDescriptionField;
