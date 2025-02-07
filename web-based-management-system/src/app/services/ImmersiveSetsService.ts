import { ImmersiveSet } from "@/types/types";
import { ObjectId } from "mongodb";
import connect from '@/app/utils/startMongo';

const client = await connect;
const db = client.db('Teacher-Management-System');

export class ImmersiveSetsService{
    private id: string
    constructor(id: string){
        this.id  = id;
    }

    async getImmersiveSet(): Promise<ImmersiveSet | null>{
        const immmersiveSetColleciton = db.collection("immersiveSets");
        
        const immersiveSet = await immmersiveSetColleciton.findOne({_id: new ObjectId(this.id)});

        return immersiveSet as ImmersiveSet | null;
    }
}