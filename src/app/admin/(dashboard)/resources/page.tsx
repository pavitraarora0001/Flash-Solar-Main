"use client";

import * as React from "react";
import { FileText, Download, ArrowUpRight } from "lucide-react";
import { DBTechnicalResource } from "@/lib/db/store";

export default function AdminResourcesPage() {
  const [resources, setResources] = React.useState<DBTechnicalResource[]>([]);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/resources");
        const data = await res.json();
        if (data.success) {
          setResources(data.resources);
        }
      } catch (err) {
        console.error("Failed to load resources:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="pb-4 border-b border-midnight-800">
        <h1 className="text-2xl font-heading font-extrabold text-ivory-100 tracking-tight">
          Technical Documentation &amp; Assets
        </h1>
        <p className="text-xs text-ivory-400 mt-1">
          Whitepapers, single-line engineering schematics, and technical datasheets.
        </p>
      </div>

      <div className="bg-midnight-900 border border-midnight-800 rounded-xl overflow-hidden shadow">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-midnight-800 bg-midnight-950/60 text-ivory-400 uppercase font-mono text-[10px]">
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4">Document Type</th>
              <th className="py-3 px-4">File Size</th>
              <th className="py-3 px-4">Total Downloads</th>
              <th className="py-3 px-4 text-right">Direct Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-midnight-800/60">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-midnight-800/30 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-ivory-100 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gold-400" />
                    <span>{res.title}</span>
                  </div>
                  <div className="text-[11px] text-ivory-400 mt-0.5">{res.summary}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-ivory-300">{res.resourceType}</td>
                <td className="py-3.5 px-4 font-mono text-ivory-400">{res.fileSize || "PDF"}</td>
                <td className="py-3.5 px-4">
                  <span className="font-mono font-bold text-gold-400">{res.downloadCount}</span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 text-xs font-mono"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
