import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, Search, Brain, Target, Zap, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/page-header";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <PageHeader
            title={t("about.hero.title")}
            description={t("about.hero.description")}
          />
        </div>

        {/* Service Introduction */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("about.service.title")}
            </h2>
          </div>

          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-lg">
              {t("about.service.description")}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("about.service.features.smartAnalysis.title")}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t("about.service.features.smartAnalysis.description")}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("about.service.features.instantInsights.title")}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {t("about.service.features.instantInsights.description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Solving */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {t("about.problems.title")}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="border-l-4 border-red-400 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                {t("about.problems.timeConstraints.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>The Problem:</strong>{" "}
                {t("about.problems.timeConstraints.problem")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Our Solution:</strong>{" "}
                {t("about.problems.timeConstraints.solution")}
              </p>
            </div>

            <div className="border-l-4 border-blue-400 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Brain className="w-5 h-5 text-blue-500 mr-2" />
                {t("about.problems.informationOverload.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>The Problem:</strong>{" "}
                {t("about.problems.informationOverload.problem")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Our Solution:</strong>{" "}
                {t("about.problems.informationOverload.solution")}
              </p>
            </div>

            <div className="border-l-4 border-green-400 pl-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="w-5 h-5 text-green-500 mr-2" />
                {t("about.problems.contextGap.title")}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>The Problem:</strong>{" "}
                {t("about.problems.contextGap.problem")}
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Our Solution:</strong>{" "}
                {t("about.problems.contextGap.solution")}
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t("about.cta.title")}
            </h3>
            <p className="text-gray-600 mb-4">{t("about.cta.description")}</p>
            <Link href={`/${locale}`}>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-medium">
                {t("about.cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
