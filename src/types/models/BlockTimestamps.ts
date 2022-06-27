// Auto-generated , DO NOT EDIT
import {Entity, FunctionPropertyNames} from "@subql/types";
import assert from 'assert';




type BlockTimestampsProps = Omit<BlockTimestamps, NonNullable<FunctionPropertyNames<BlockTimestamps>>>;

export class BlockTimestamps implements Entity {

    constructor(id: string) {
        this.id = id;
    }


    public id: string;

    public blockNumber: bigint;

    public timestamp: Date;


    async save(): Promise<void>{
        let id = this.id;
        assert(id !== null, "Cannot save BlockTimestamps entity without an ID");
        await store.set('BlockTimestamps', id.toString(), this);
    }
    static async remove(id:string): Promise<void>{
        assert(id !== null, "Cannot remove BlockTimestamps entity without an ID");
        await store.remove('BlockTimestamps', id.toString());
    }

    static async get(id:string): Promise<BlockTimestamps | undefined>{
        assert((id !== null && id !== undefined), "Cannot get BlockTimestamps entity without an ID");
        const record = await store.get('BlockTimestamps', id.toString());
        if (record){
            return BlockTimestamps.create(record as BlockTimestampsProps);
        }else{
            return;
        }
    }



    static create(record: BlockTimestampsProps): BlockTimestamps {
        assert(typeof record.id === 'string', "id must be provided");
        let entity = new BlockTimestamps(record.id);
        Object.assign(entity,record);
        return entity;
    }
}
