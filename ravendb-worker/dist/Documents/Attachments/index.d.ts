/// <reference types="node" />
import * as stream from "readable-stream";
import { HttpResponse } from "../../Primitives/Http";
import { CapitalizeType } from "../../Types";
export declare type AttachmentType = "Document" | "Revision";
export interface AttachmentName {
    name: string;
    hash: string;
    contentType: string;
    size: number;
}
export interface IAttachmentObject extends CapitalizeType<AttachmentName> {
    getContentAsString(): string;
    getContentAsString(encoding: string): string;
    getContentAsStream(): any;
}
export interface AttachmentDetails extends AttachmentName {
    changeVector: string;
    documentId?: string;
}
export declare class AttachmentResult {
    data: stream.Readable;
    details: AttachmentDetails;
    private _response;
    constructor(data: stream.Readable, details: AttachmentDetails, _response: HttpResponse);
    dispose(): void;
}
export declare type AttachmentData = stream.Readable | Buffer;
