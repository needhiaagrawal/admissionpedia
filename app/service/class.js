import Classes from "../models/classes";

export const getClassesList = async () => {
    let classesList = await Classes.findAll({ raw: false });
    return classesList
}