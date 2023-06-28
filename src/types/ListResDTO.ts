export interface ListResDTO<DataType> {
    list?: DataType[];
    current?: number;
    pageSize?: number;
    total?: number;

}