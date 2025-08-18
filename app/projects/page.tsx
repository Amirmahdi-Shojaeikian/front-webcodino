import { allProjects, type Project } from "./data";
import Image from "next/image";
import type { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "پروژه‌های وب کدینو | نمونه کار طراحی سایت و اپلیکیشن",
  description: "نمونه پروژه‌های انجام شده توسط تیم وب کدینو در زمینه طراحی سایت، اپلیکیشن، هاست و خدمات سرور.",
  keywords: "نمونه کار, پروژه طراحی سایت, پروژه اپلیکیشن, وب کدینو",
};

export default function ProjectsPage() {
  const projects: Project[] = allProjects;

  return (
    <section className="mt-6 sm:mt-8">
      <div className="grid grid-cols-1 gap-6">
        <main className="border rounded-2xl p-5 [direction:rtl] max-h-[75vh] overflow-y-auto pl-2 bg-background/20 backdrop-blur-sm">
          <div className="[direction:rtl] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {projects.map((p) => (
              <article
                key={p.id}
                className="h-full min-h-80 border-2 border-white rounded-2xl p-6 bg-black flex flex-col"
              >
                <div className="flex justify-center mb-4">
                  {p.logo && (
                    <div className="w-24 h-24 relative">
                      <Image
                        src={p.logo}
                        alt={`${p.title} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>
                <h3 className="text-white text-lg font-semibold text-center mb-3">
                  {p.title}
                </h3>
                <p className="text-white/80 text-sm text-center mb-6 flex-grow">
                  {p.desc}
                </p>
                <div className="flex items-center justify-center">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border-2 border-white bg-black text-white px-6 py-3 text-sm hover:bg-white hover:text-black transition-colors duration-200"
                    >
                      مشاهده نمونه کار
                    </a>
                  ) : (
                    <span className="rounded-xl border-2 border-white bg-black text-white px-6 py-3 text-sm opacity-50">
                      مشاهده نمونه کار
                    </span>
                  )}
                </div>
              </article>
            ))}
            {projects.length === 0 && (
              <div className="col-span-3 text-center text-foreground/70 py-10">پروژه‌ای مطابق فیلترها یافت نشد.</div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
}


