import { isArrayLike } from "lodash";
import { Primitive } from "utility-types";
import validator from "validator";
import { CollectionPermission } from "../shared/types";
import { validateColorHex } from "../shared/utils/color";
import { validateIndexCharacters } from "../shared/utils/indexCharacters";
import { ParamRequiredError, ValidationError } from "./errors";

type IncomingValue = Primitive | string[];

export const assertPresent = (value: IncomingValue, message: string) => {
  if (value === undefined || value === null || value === "") {
    throw ParamRequiredError(message);
  }
};

export function assertArray(
  value: IncomingValue,
  message?: string
): asserts value {
  if (!isArrayLike(value)) {
    throw ValidationError(message);
  }
}

export const assertIn = (
  value: string,
  options: Primitive[],
  message?: string
) => {
  if (!options.includes(value)) {
    throw ValidationError(message ?? `Must be one of ${options.join(", ")}`);
  }
};

export const assertSort = (
  value: string,
  model: any,
  message = "Invalid sort parameter"
) => {
  if (!Object.keys(model.rawAttributes).includes(value)) {
    throw ValidationError(message);
  }
};

export function assertNotEmpty(
  value: IncomingValue,
  message: string
): asserts value {
  assertPresent(value, message);

  if (typeof value === "string" && value.trim() === "") {
    throw ValidationError(message);
  }
}

export function assertEmail(
  value: IncomingValue = "",
  message?: string
): asserts value {
  if (typeof value !== "string" || !validator.isEmail(value)) {
    throw ValidationError(message);
  }
}

export function assertUrl(
  value: IncomingValue = "",
  message?: string
): asserts value {
  if (
    typeof value !== "string" ||
    !validator.isURL(value, {
      protocols: ["http", "https"],
      require_valid_protocol: true,
    })
  ) {
    throw ValidationError(message ?? `${String(value)} is an invalid url!`);
  }
}

export function assertUuid(
  value: IncomingValue,
  message?: string
): asserts value {
  if (typeof value !== "string") {
    throw ValidationError(message);
  }
  if (!validator.isUUID(value)) {
    throw ValidationError(message);
  }
}

export const assertPositiveInteger = (
  value: IncomingValue,
  message?: string
) => {
  if (
    !validator.isInt(String(value), {
      min: 0,
    })
  ) {
    throw ValidationError(message);
  }
};

export const assertHexColor = (value: string, message?: string) => {
  if (!validateColorHex(value)) {
    throw ValidationError(message);
  }
};

export const assertValueInArray = (
  value: string,
  values: string[],
  message?: string
) => {
  if (!values.includes(value)) {
    throw ValidationError(message);
  }
};

export const assertIndexCharacters = (
  value: string,
  message = "index must be between x20 to x7E ASCII"
) => {
  if (!validateIndexCharacters(value)) {
    throw ValidationError(message);
  }
};

export const assertCollectionPermission = (
  value: string,
  message = "Invalid permission"
) => {
  assertIn(value, [...Object.values(CollectionPermission), null], message);
};
