import {createDslServices} from "../language/dsl-module.js";
import {EmptyFileSystem} from "langium";
import {parseHelper} from "langium/test";
import {Model} from "../language/generated/ast.js";

export function createParser() {
    const services = createDslServices(EmptyFileSystem);
    return parseHelper<Model>(services.Dsl);
}